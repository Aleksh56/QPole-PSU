FROM python:3.11.5-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory
WORKDIR /app

# Copy the entire project to the working directory
COPY . /app/

# Copy the requirements file separately to leverage Docker cache
COPY ./requirements.txt /app/

# Install system dependencies
RUN apt-get update --allow-unauthenticated \
    && apt-get install -y python3-dev mariadb-client build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies, including MySQL Connector
RUN pip install -r requirements.txt

# Run migrations
RUN python manage.py makemigrations

# Apply migrations
RUN python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Run Gunicorn
ENTRYPOINT ["gunicorn", "qpoll.wsgi", "-b", "0.0.0.0:8000"]
