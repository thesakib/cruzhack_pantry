"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


### Define your table below
#
db.define_table('foods',
    Field('food_name', requires=IS_NOT_EMPTY()),
    Field('date', 'date')
)
#
## always commit your models to avoid problems later

db.commit()
