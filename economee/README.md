# Econome 

The guide bellow will hell you to initialize the application

## How to Use

To use this project, follow these steps:

1. Create your working environment ([venv](https://docs.python.org/3/library/venv.html)).  <br> <br>
   
2. Activate the virtual environment:<br>
   2.1 Windows: Via CMD, type:<br> 
   `env folder/Scripts/activate`<br>
   \***(env name)** will appear before the path way in CMD. <br> <br>

3. Install requirements.txt by going to the project root and typing:<br> 
   `python3 -m pip install -r requirements.txt`<br> <br>
   
4. Create the `economee` database in Oracle. Install cx_oracle in the OS. ([cx oracle](https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html#id1)) <br> <br>
   To fix windows error of module not found do this in cmd:<br>
   `set TNS_ADMIN=C:\oracle set ORACLE_HOME=C:\oracle`<br><br>
5. With the database created, import the migrations to the database by typing:<br>
   `python3 manage.py migrate`<br> <br>

6. Run the project by typing:<br>
   `python manage.py runserver`<br> <br>
   
7. The `localhost:\<port>` will deploy the application.
