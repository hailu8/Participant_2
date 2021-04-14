import csv
try:
    import simplejson as json
except ImportError:
    import json
from flask import Flask,request,Response,render_template,url_for
from itertools import groupby 
import itertools
import operator
import time
from collections import defaultdict
from operator import itemgetter
import psycopg2 # use this package to work with postgresql
import psycopg2.extras
import pylru
app = Flask(__name__)
def query_db(query):
  conn = psycopg2.connect("dbname='a3database' user='cmsc828d' host='localhost' password='1234'")
  cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  now = time.time()
  cur.execute(query)
  first_time = time.time() - now
  result = cur.fetchall()
  r = []
  Now_2 = time.time()
  for row in result:
    r.append(dict(row))
  second_time = time.time() - Now_2
  cur.connection.close()
  return r, first_time, second_time
size = 50
cache = pylru.lrucache(size)


@app.route('/')
def renderPage():
  return render_template("index.html")


@app.route('/allAthletesTORbyIncome')#//////////////////////////////////////////////////////////////////////////////////allAthletesTORbyIncome API////////////////////////////////////////
def allAthletesTORbyIncome():
  Timed_AAI= time.time()
  first_time = second_time = 0
  year = request.args.get('year')
  # sql = "SELECT * FROM CALL AthleteIncome(%s);", (year,)
  sql = "SELECT * FROM AIncome where year = "+ year + ""
  AAI = cache
  if sql in AAI.keys():
    result = AAI[sql] 
  else:
    result, first_time, second_time = query_db(sql)
    for dictionary in result:
      if (dictionary["sex"] == "F"):
        # F = True
        dictionary["records"] = -1 * dictionary["records"] 
    AAI[sql] = result   
  FinalTime_AAI = time.time() - Timed_AAI
  Finish_time = Timed_AAI + FinalTime_AAI
  resp = Response(response=json.dumps({"result": result, "time": { "Total_query_time_AAI": FinalTime_AAI, "Time_received_server": Timed_AAI,  "Finish_time": Finish_time, "execute_query_db": first_time, "loop_query_db": second_time }}),status=200, mimetype='application/json')
  h = resp.headers
  h['Access-Control-Allow-Origin'] = "*"
  return resp

@app.route('/allAthletesTORbyCountry')#//////////////////////////////////////////////////////////////////////////////////allAthletesTORbyCountry API////////////////////////////////////////
def allAthletesTORbyCountry():
  Timed_AAC= time.time()
  first_time = second_time = 0
  year = request.args.get('year')
  sql = " SELECT * FROM ACountry  where years = " + year + "  "
  AAC = cache
  if sql in AAC.keys():
    result = AAC[sql]
  else:
    result, first_time, second_time = query_db(sql)
    for dictionary in result:
      if (dictionary["sex"] == "F"):
        dictionary["records"] = -1 * dictionary["records"] 
    AAC[sql] = result
  FinalTime_AAC = time.time() - Timed_AAC
  Finish_time = Timed_AAC + FinalTime_AAC
  resp = Response(response=json.dumps({"result": result, "time": { "Total_query_time_AAC": FinalTime_AAC, "Time_received_server": Timed_AAC, "Finish_time": Finish_time, "execute_query_db": first_time, "loop_query_db": second_time }}),status=200, mimetype='application/json')
  h = resp.headers
  h['Access-Control-Allow-Origin'] = "*"
  return resp

@app.route('/allmedalistTORbyCountry')#//////////////////////////////////////////////////////////////////////////////////allmedalistTORbyCountry API////////////////////////////////////////
def allmedalistTORbyCountry():
  Timed_AMC= time.time()
  first_time = second_time = 0
  year = request.args.get('year')
  sql = "SELECT * FROM MCountry where year = " + year + " "
  AMC = cache
  if sql in AMC.keys():
    result = AMC[sql]
  else:
    result, first_time, second_time = query_db(sql)
    for dictionary in result:
      if (dictionary["sex"] == "F"):
        dictionary["records"] = -1 * dictionary["records"] 
    AMC[sql] = result
  FinalTime_AMC = time.time() - Timed_AMC
  Finish_time = Timed_AMC + FinalTime_AMC
  resp = Response(response=json.dumps({"result": result, "time": { "Total_query_time_AMC": FinalTime_AMC, "Time_received_server": Timed_AMC, "Finish_time": Finish_time, "execute_query_db": first_time, "loop_query_db": second_time }}),status=200, mimetype='application/json')
  h = resp.headers
  h['Access-Control-Allow-Origin'] = "*"
  return resp

@app.route('/allmedalistTORbyIncome')#//////////////////////////////////////////////////////////////////////////////////allmedalistTORbyIncome API////////////////////////////////////////
def allmedalistTORbyIncome():
  Timed_AMI= time.time()
  first_time = second_time = 0
  year = request.args.get('year')
  sql = "SELECT * FROM MIncome  where year = " + year + " "
  AMI = cache
  if sql in AMI.keys():
    result = AMI[sql]
    AMI[sql] = result
  else:
    result, first_time, second_time = query_db(sql)
    # print(f"len2 {len(result)} year {year}")
    for dictionary in result:
      if (dictionary["sex"] == "F"):
        # F = True
        dictionary["records"] = -1 * dictionary["records"] 
    AMI[sql] = result
    # if F:
    #   print("hey!")
  FinalTime_AMI = time.time() - Timed_AMI
  Finish_time = Timed_AMI + FinalTime_AMI
  resp = Response(response=json.dumps({"result": result, "time": { "Total_query_time_AMI": FinalTime_AMI, "Time_received_server": Timed_AMI, "Finish_time": Finish_time, "execute_query_db": first_time, "loop_query_db": second_time }}),status=200, mimetype='application/json')
  h = resp.headers
  h['Access-Control-Allow-Origin'] = "*"
  return resp



@app.route('/processed_income_data')#//////////////////////////////////////////////////////////////////////////////////allmedalistTORbyIncome API////////////////////////////////////////
def processed_income_data():
  Timed_PID= time.time()
  first_time = second_time = 0
  year = request.args.get('year')
  sql = " SELECT * FROM idata where (idata.years)::integer = "+ year +" "
  PID = cache
  if sql in PID.keys():
    new_dict = PID[sql]
  else:
    result, first_time, second_time = query_db(sql)
    new_dict = {}
    for i in result:
      if i['years'] in new_dict.keys():
          res= new_dict[i['years']]
          res.append(i)
      else:
          new_dict[i['years']] = [i]
    PID[sql] = new_dict
  FinalTime_PID = time.time() - Timed_PID
  Finish_time = Timed_PID + FinalTime_PID
  resp = Response(response=json.dumps({"result": new_dict, "time": { "Total_query_time_PID": FinalTime_PID, "Time_received_server": Timed_PID, "Finish_time": Finish_time, "execute_query_db": first_time, "loop_query_db": second_time }}),status=200, mimetype='application/json')
  h = resp.headers
  h['Access-Control-Allow-Origin'] = "*"
  return resp

@app.route('/getjson-data')
def getData():
  filename = request.args.get('filename')
  try:
    data = json.load(open(filename))
    resp = Response(response=json.dumps(data),status=200, mimetype='application/json')
    h = resp.headers
    h['Access-Control-Allow-Origin'] = "*"
    return resp
  except Exception as err:
    #print(err)
    #return str(err)
    raise err


if __name__ == "__main__":
  app.run(debug=True,port=8000)
