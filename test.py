from app import app, db

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     phone = db.Column(db.String(120), unique=True, nullable=False)

class details(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # user = db.relationship('User', backref=db.backref('details', lazy=True))

with app.app_context():
    db.create_all()
    # new_user = User(username='testuser', email='testuser@example.com', phone ="+2001289517247")
    # db.session.add(new_user)
    # db.session.commit()
    print("Database tables created and row inserted!")
