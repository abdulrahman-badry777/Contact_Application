from flask import Flask, render_template, request, redirect, jsonify, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/mydb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

# Define Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password': self.password
        }

    def __repr__(self):
        return f'<User {self.username}>'

class Detail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('details', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Detail {self.name}>'

@app.route('/', methods=['GET'])
def login():
    try:
        return render_template("login.html", custom_css="login")
    except Exception as e:
        return jsonify({'Invalid input or other business errors':str(e)}), 500

@app.route('/contact-list')
def contact_list():
    return render_template("contact-list.html", custom_css="contact-list")

@app.route('/view')
def view():
    return render_template("view.html", custom_css="view")

@app.route('/add-contact', methods=['GET', 'POST'])
def add_contact():
    if request.method == 'POST':
        try:
            name = request.form['name']
            phone_number = request.form['phone_number']
            email = request.form['email']
            user_id = request.form['user_id']  # Get user ID from form

            new_contact = Detail(name=name, phone_number=phone_number, email=email, user_id=user_id)
            db.session.add(new_contact)
            db.session.commit()
            return redirect('/contact-list') , 201
        except Exception as e:
            return jsonify({'Invalid input or other business errors': str(e)}), 400
    return render_template("add-contact.html", custom_css="add-contact")

@app.route('/update-contact/<int:id>', methods=['POST'])
def update_contact(id):
    try:
        contact = Detail.query.get(id)
        if contact:
            contact.name = request.form.get('name')
            contact.email = request.form.get('email')
            contact.phone_number = request.form.get('phone_number')
            db.session.commit()
            return jsonify({'message': 'Contact updated successfully'}), 200
        else:
            return jsonify({'error': 'Invalid input or other business errors'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete-contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    try:
        contact = Detail.query.get(id)
        if contact:
            db.session.delete(contact)
            db.session.commit()
            return '', 204
        else:
            return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/coo', methods=['GET'])
def coo():
    try:
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/det', methods=['GET'])
def det():
    try:
        details = Detail.query.all()
        details_list = [detail.to_dict() for detail in details]
        return jsonify(details_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure that the database tables are created before running the app
    app.run(debug=True)
