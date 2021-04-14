
## Identifier == Participant_2
## Welcome to the user study!
### Prerequisite
1. Please install pip3 and postgresql if you don't have it.
2. Install pip3 install Flask-Psycopg2
3. Make sure you have an empty database created to load the .sql file.  In my case, I am using a database called "a3database."
4. Go to the working directory and open the Postgres server using the terminal. 
        To start the Postgres environment type and load the .sql use
			psql -U cmsc828d -d a3database -1 -f  C:\path_to_where_Paticipant_1_is_stored/A4.sql
After this step, you have successfully loaded the table into the database.
5. pip install pylru==1.0.2 on your command line (this downloads a library to use LRU cache) else it will throw out an error 
### Running the code locally
1. Run `cd Participant_1 folder`.
2. Run `python -m http.server 8080` (for python 3).
3. Run server.py, and open http://127.0.0.1:8000/ with your browser.
### Collect log data
After you are done exploring 
1. Right click, click on inspect, then navigate to console and the log data on the console can be be saved by right clicking within the console window and selecting "save as" in the menu ([instructions here. ](https://support.shortpoint.com/support/solutions/articles/1000222881-save-google-chrome-browser-s-console-file))
2. Please fill out this survey [click here](https://www.surveymonkey.com/r/7M6YJGB)
3. Don't forget to send me the log data via email or slack :)
