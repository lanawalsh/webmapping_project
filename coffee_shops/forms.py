# coffee_shops/forms.py

from django import forms
from django.contrib.gis.geos import Point
from .models import CoffeeShopSubmission

class CoffeeShopSubmissionForm(forms.ModelForm):
    """Form for users to submit new coffee shops"""
    
    # Override location to accept lat/lng
    latitude = forms.FloatField(
        widget=forms.HiddenInput(),
        required=True,
        help_text="Click on the map to set location"
    )
    longitude = forms.FloatField(
        widget=forms.HiddenInput(),
        required=True
    )
    
    class Meta:
        model = CoffeeShopSubmission
        fields = [
            'name', 'address', 'area', 'rating',
            'wifi', 'outdoor_seating', 'notes',
            'submitted_by_name', 'submitted_by_email'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., The Coffee House'
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 2,
                'placeholder': '123 Main Street, Dublin 2'
            }),
            'area': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Temple Bar, Ballsbridge'
            }),
            'rating': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 5,
                'step': 0.1,
                'placeholder': '4.5'
            }),
            'notes': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Any additional information (opening hours, specialties, etc.)'
            }),
            'submitted_by_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your name (optional)'
            }),
            'submitted_by_email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'your.email@example.com (optional)'
            }),
        }
        labels = {
            'wifi': 'Has WiFi',
            'outdoor_seating': 'Has Outdoor Seating',
            'submitted_by_name': 'Your Name',
            'submitted_by_email': 'Your Email'
        }
    
    def clean(self):
        cleaned_data = super().clean()
        lat = cleaned_data.get('latitude')
        lng = cleaned_data.get('longitude')
        
        if lat and lng:
            # Create Point from lat/lng
            cleaned_data['location'] = Point(lng, lat, srid=4326)
        else:
            raise forms.ValidationError(
                "Please click on the map to set the coffee shop location."
            )
        
        return cleaned_data
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.location = self.cleaned_data['location']
        
        if commit:
            instance.save()
        
        return instance