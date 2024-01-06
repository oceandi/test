from PIL import Image
import pytesseract
import tkinter as tk
from tkinter import filedialog
import pyperclip

# Ensure tesseract is in your PATH or use the following to set tesseract path
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # For Windows
# pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'  # For MacOS (if installed via Homebrew)

def extract_text_from_image(image_path):
    # Open the image
    image = Image.open(image_path)
    
    # Use pytesseract to get the text
    text = pytesseract.image_to_string(image)
    
    return text

if __name__ == "__main__":
    # Create a root window and immediately hide it (we only want the file dialog)
    root = tk.Tk()
    root.withdraw()

    # Prompt the user to select a file using a dialog
    file_types = [
    ("PNG files", "*.png"),
    ("JPEG files", "*.jpg;*.jpeg"),
    ("BMP files", "*.bmp"),
    ("All files", "*.*")
    ]

    image_path = filedialog.askopenfilename(title="Select an image", filetypes=file_types)

    # Check if user selected a file or cancelled the dialog
    if image_path:
        extracted_text = extract_text_from_image(image_path)
        print(extracted_text)
        
        # Copy the extracted text to the clipboard
        pyperclip.copy(extracted_text)
        print("Text has been copied to clipboard!")
        
    else:
        print("No image selected.")