from django.core.exceptions import ValidationError
import os


def allow_only_images_validator(value):
    ext = os.path.splitext(value.name)[1] # background-image.jpg
    print(ext)
    valid_extensions = ['.png', '.jpg', '.jpeg','.webp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension! Allowed extensions are: ' +str(valid_extensions))