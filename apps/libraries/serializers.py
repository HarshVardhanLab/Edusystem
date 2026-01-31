from rest_framework import serializers
from .models import Library

class LibrarySerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    
    class Meta:
        model = Library
        fields = [
            'id', 'owner', 'owner_email', 'name', 'address', 'phone',
            'total_seats', 'opening_time', 'closing_time', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def validate(self, data):
        if 'opening_time' in data and 'closing_time' in data:
            if data['opening_time'] >= data['closing_time']:
                raise serializers.ValidationError("Closing time must be after opening time")
        return data
