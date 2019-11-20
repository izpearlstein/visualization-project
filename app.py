import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.sqlite"

db = SQLAlchemy(app)


# Create our database model
class Reviews(db.Model):
    __tablename__ = 'Reviews'

    reviewid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    artist = db.Column(db.String)
    url = db.Column(db.String)
    score = db.Column(db.Float)
    best_new_music = db.Column(db.Integer)
    author = db.Column(db.String)
    author_type = db.Column(db.String)
    pub_date = db.Column(db.String)
    pub_weekday = db.Column(db.Integer)
    pub_day = db.Column(db.Integer)
    pub_month = db.Column(db.Integer)
    pub_year = db.Column(db.Integer)

    def __repr__(self):
        return '<Review %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()


@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/title")
def artist_data():
    """Return album, artist, and score"""

    # Query for the top 10 emoji data
    results = db.session.query(Reviews.title, Reviews.artist, Reviews.score).\
        order_by(Reviews.score.desc()).\
        limit(10).all()

    # Create lists from the query results
    title = [result[0] for result in results]
    artist = [result[1] for result in results]
    scores = [int(result[2]) for result in results]

    # Generate the plot trace
    trace = {
        "x": title,
        "y": scores,
        "type": "bar"
    }
    return jsonify(trace)


@app.route("/title_id")
def title_data():
    """Return emoji score and emoji id"""

    # Query for the emoji data using pandas
    query_statement = db.session.query(Reviews).\
        order_by(Reviews.score.desc()).\
        limit(10).statement
    df = pd.read_sql_query(query_statement, db.session.bind)

    # Format the data for Plotly
    trace = {
        "x": df["title"].values.tolist(),
        "y": df["score"].values.tolist(),
        "type": "bar"
    }
    return jsonify(trace)


@app.route("/artist_name")
def emoji_name_data():
    """Return emoji score and emoji name"""

    # Query for the top 10 emoji data
    results = db.session.query(Reviews.artist, Reviews.score).\
        order_by(Reviews.score.desc()).\
        limit(10).all()
    df = pd.DataFrame(results, columns=['artist', 'score'])

    # Format the data for Plotly
    plot_trace = {
        "x": df["artist"].values.tolist(),
        "y": df["score"].values.tolist(),
        "type": "bar"
    }
    return jsonify(plot_trace)


if __name__ == '__main__':
    app.run(debug=True)
