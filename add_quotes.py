#!/usr/bin/env python
"""Script to add motivational quotes to the database"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_backend.settings')
django.setup()

from apps.students.study_models import MotivationalQuote

quotes_data = [
    {
        'quote': 'Success is the sum of small efforts repeated day in and day out.',
        'author': 'Robert Collier',
        'category': 'SUCCESS'
    },
    {
        'quote': 'The expert in anything was once a beginner.',
        'author': 'Helen Hayes',
        'category': 'STUDY'
    },
    {
        'quote': 'Education is the most powerful weapon which you can use to change the world.',
        'author': 'Nelson Mandela',
        'category': 'STUDY'
    },
    {
        'quote': 'The only way to do great work is to love what you do.',
        'author': 'Steve Jobs',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'Believe you can and you\'re halfway there.',
        'author': 'Theodore Roosevelt',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'It does not matter how slowly you go as long as you do not stop.',
        'author': 'Confucius',
        'category': 'PERSEVERANCE'
    },
    {
        'quote': 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        'author': 'Winston Churchill',
        'category': 'PERSEVERANCE'
    },
    {
        'quote': 'The future belongs to those who believe in the beauty of their dreams.',
        'author': 'Eleanor Roosevelt',
        'category': 'INSPIRATION'
    },
    {
        'quote': 'Don\'t watch the clock; do what it does. Keep going.',
        'author': 'Sam Levenson',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'The secret of getting ahead is getting started.',
        'author': 'Mark Twain',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.',
        'author': 'Abigail Adams',
        'category': 'STUDY'
    },
    {
        'quote': 'The beautiful thing about learning is that no one can take it away from you.',
        'author': 'B.B. King',
        'category': 'STUDY'
    },
    {
        'quote': 'Strive for progress, not perfection.',
        'author': 'Unknown',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'Your limitation—it\'s only your imagination.',
        'author': 'Unknown',
        'category': 'INSPIRATION'
    },
    {
        'quote': 'Great things never come from comfort zones.',
        'author': 'Unknown',
        'category': 'MOTIVATION'
    },
    {
        'quote': 'Dream it. Wish it. Do it.',
        'author': 'Unknown',
        'category': 'INSPIRATION'
    },
    {
        'quote': 'Success doesn\'t just find you. You have to go out and get it.',
        'author': 'Unknown',
        'category': 'SUCCESS'
    },
    {
        'quote': 'The harder you work for something, the greater you\'ll feel when you achieve it.',
        'author': 'Unknown',
        'category': 'SUCCESS'
    },
    {
        'quote': 'Dream bigger. Do bigger.',
        'author': 'Unknown',
        'category': 'INSPIRATION'
    },
    {
        'quote': 'Don\'t stop when you\'re tired. Stop when you\'re done.',
        'author': 'Unknown',
        'category': 'PERSEVERANCE'
    },
]

# Add quotes to database
for quote_data in quotes_data:
    quote, created = MotivationalQuote.objects.get_or_create(
        quote=quote_data['quote'],
        defaults={
            'author': quote_data['author'],
            'category': quote_data['category']
        }
    )
    if created:
        print(f"✓ Added: {quote_data['quote'][:50]}...")
    else:
        print(f"- Already exists: {quote_data['quote'][:50]}...")

print(f"\n✅ Total quotes in database: {MotivationalQuote.objects.count()}")
