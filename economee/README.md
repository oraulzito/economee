# Econome 

The guide bellow will hell you to initialize the application

## How to Use

To use this project, follow these steps:

1. Create your working environment ([venv](https://docs.python.org/3/library/venv.html)).  <br> <br>

2. Activate the virtual environment:<br>
   2.1 Windows: Via CMD, type:<br> 
   `env folder/Scripts/activate`<br>
   \***(env name)** will appear before the path way in CMD. <br> <br>

3. (Ignore this step if everything work without errors) If you are running the project on Windows, some exceptions probably will appear on your enviroment, open the Windows PowerShell as an Administrator and run: <br>
   `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine` <br><br>

4. Install requirements.txt by going to the project root and typing:<br> 
   `python3 -m pip install -r requirements.txt`<br> <br>
   
5. Create the `economee` database in PostgresSQL.<br> <br>
   
6. With the database created, import the migrations to the database by typing:<br>
   `python3 manage.py migrate`<br> <br>
   
7. Insert the currencies list data, available file in:<br>
   `/documentation/currencies.sql`<br> <br>

8. If no errors occur, create the super user (use the name admin) by typing:<br>
   `python manage.py createsuperuser`<br> <br>
   
9. Run the project by typing:<br>
   `python manage.py runserver`<br> <br>
   
10. The `localhost:\<port>\admin` will deploy the application.
<br><br>

11. API tests will be available on `localhost:<port>/api/v1/<endpoint>`
