from flask.sessions import SessionInterface, SessionMixin
from werkzeug.datastructures import CallbackDict
from azure.cosmos import CosmosClient
import uuid
import datetime

class CosmosDBSession(CallbackDict, SessionMixin):
    pass

class CosmosDBSessionInterface(SessionInterface):
    def __init__(self, database_url, master_key, database_name, container_name):
        self.client = CosmosClient(database_url, credential=master_key)
        self.database = self.client.get_database_client(database_name)
        self.container = self.database.get_container_client(container_name)

    def open_session(self, app, request):
        session_id = request.cookies.get(app.session_cookie_name)
        if session_id:
            item = self.container.read_item(item=session_id, partition_key=session_id)
            data = item['data']
        else:
            session_id = str(uuid.uuid4())
            data = {}
        return CosmosDBSession(data, sid=session_id, new=not session_id)

    def save_session(self, app, session, response):
        domain = self.get_cookie_domain(app)
        if not session:
            if session.modified:
                self.container.delete_item(item=session.sid, partition_key=session.sid)
                response.delete_cookie(app.session_cookie_name, domain=domain)
            return

        if self.should_set_cookie(app, session):
            expires = self.get_expiration_time(app, session)
            response.set_cookie(app.session_cookie_name, session.sid,
                                expires=expires, httponly=True,
                                domain=domain)
        
        item = {
            'id': session.sid,
            'data': dict(session),
            'ttl': int((expires - datetime.datetime.utcnow()).total_seconds())
        }
        self.container.upsert_item(item)