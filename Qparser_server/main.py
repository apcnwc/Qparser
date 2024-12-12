#Copyright © 2024 apcnwc
#SPDX-License-Identifier: Apache-2.0

from aiohttp import web
import aiohttp_cors
from urllib.parse import unquote

import sqlite3
import json
import sys

class QpDataBase:
    
    def __init__(self, name):
        connection = sqlite3.connect(name)
        cursor = connection.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS "questions" (
	    "id"	INTEGER NOT NULL UNIQUE,
	    "mid"	TEXT,
	    "question"	TEXT,
	    "img"	BLOB,
	    "category"	TEXT,
	    "answers"	TEXT,
	    "rightanswer"	TEXT,
	    "rightanswernum"	INTEGER,
	    PRIMARY KEY("id" AUTOINCREMENT)
        );
        ''')
    
        connection.commit()
        connection.close()

    def InsertQuestion(self, que):
        
        connection = sqlite3.connect(dbname)
        cursor = connection.cursor()

        if len(que["imagePath"]) != 0:
            with open(unquote(que["imagePath"][7:]), mode='rb') as file:
                fileContent = file.read()
                cursor.execute('''INSERT INTO questions 
                       (mid, question, category, rightanswer, rightanswernum, answers, img) VALUES (?, ?, ?, ?, ?, ?, ?)''',
                        (que["mid"], que["text"], que["category"], que["rightAnswer"], que["rightAnswerNum"], 
                        json.dumps(que["answers"]), fileContent))
        else:
            cursor.execute('''INSERT INTO questions 
                (mid, question, category, rightanswer, rightanswernum, answers) VALUES (?, ?, ?, ?, ?, ?)''',
                (que["mid"], que["text"], que["category"], que["rightAnswer"], que["rightAnswerNum"], 
                json.dumps(que["answers"])))
        
        connection.commit()
        connection.close()

        
class QpWebReciver:
    
    def __init__(self, dbName):
        self.db = QpDataBase(dbName)
    
    async def Message(self, request):
        try:
            data = await request.json()
            for que in data["a"]:
                    self.db.InsertQuestion(que)

            print("Added " + str(len(data["a"])))
        except ValueError:
            print('ERR: JSON parsing error')
            return web.Response(status=500)
        except:
            print('ERR: Error')
            return web.Response(status=500)
        else:
            return web.Response()
                    
dbname = "test3.db"

if __name__ == '__main__':
    try:
        app = web.Application()
        reciver = QpWebReciver(dbname)
        app.add_routes([web.post('/', reciver.Message),
                        ])
        

        cors = aiohttp_cors.setup(app, defaults={
                "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        })
        for route in list(app.router.routes()):
            cors.add(route)

    except:
        sys.exit(1)
    
    web.run_app(app, host="localhost", port=7070)