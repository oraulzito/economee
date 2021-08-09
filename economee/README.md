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
   
4. Create the `economee` database in PostgresSQL.<br> <br>
   
5. With the database created, import the migrations to the database by typing:<br>
   `python3 manage.py migrate`<br> <br>
   
6. Insert the currencies list data, available file in:<br>
   `/documentation/currencies.sql`<br> <br>

7. If no errors occur, create the super user (use the name admin) by typing:<br>
   `python manage.py createsuperuser`<br> <br>
   
8. Run the project by typing:<br>
   `python manage.py runserver`<br> <br>
   
9. The `localhost:\<port>\admin` will deploy the application.
<br><br>
10. API tests will be available on `localhost:<port>/api/v1/<endpoint>`
