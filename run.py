from flask import Flask, render_template
from flask import Flask, request
from flask import Flask, g
import sqlite3


app = Flask(__name__)
db_location = 'lb/leaderboardDB.db'

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = sqlite3.connect(db_location)
        g.db = db
    return db

@app.teardown_appcontext
def close_db_connection(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.route('/', methods=['POST','GET'])
@app.route('/home', methods=['POST','GET'])
def home():
    db = get_db()
    if request.method == 'POST':
        print (request.form)


        username = request.form['usernameForm']
        highscore = int(request.form['highscoreForm'])
        db.cursor().execute('insert into leaderboard values(?,?)',(username,highscore))
        db.commit()
        return render_template('index.html')
    else:
        return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/leaderboard')
def leaderboard():
    db = get_db()
    page = []
    page.append('<html><ol>')
    sql = "SELECT DISTINCT username, highscore FROM leaderboard ORDER BY highscore DESC"
    for row in db.cursor().execute(sql):
        page.append('<li>')
        page.append(str(row))
        page.append('</li>')

    page.append('</ol></html>')
    return ''.join(page)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
