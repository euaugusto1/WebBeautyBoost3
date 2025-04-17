from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from models import User

class LoginForm(FlaskForm):
    username = StringField('Usuário', validators=[DataRequired(message="O nome de usuário é obrigatório")])
    password = PasswordField('Senha', validators=[DataRequired(message="A senha é obrigatória")])
    remember_me = BooleanField('Lembrar de mim')
    submit = SubmitField('Entrar')

class RegistrationForm(FlaskForm):
    username = StringField('Nome de Usuário', 
                         validators=[
                             DataRequired(message="O nome de usuário é obrigatório"),
                             Length(min=3, max=20, message="O nome de usuário deve ter entre 3 e 20 caracteres")
                         ])
    email = StringField('Email', 
                      validators=[
                          DataRequired(message="O email é obrigatório"),
                          Email(message="Insira um endereço de email válido")
                      ])
    password = PasswordField('Senha', 
                           validators=[
                               DataRequired(message="A senha é obrigatória"),
                               Length(min=6, message="A senha deve ter pelo menos 6 caracteres")
                           ])
    confirm_password = PasswordField('Confirmar Senha', 
                                   validators=[
                                       DataRequired(message="A confirmação de senha é obrigatória"),
                                       EqualTo('password', message="As senhas devem ser iguais")
                                   ])
    submit = SubmitField('Registrar')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Este nome de usuário já está em uso. Por favor, escolha outro.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Este email já está registrado. Por favor, use outro ou faça login.')