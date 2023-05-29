FROM tensorflow/tensorflow:latest-py3

WORKDIR /app

COPY server.py .
COPY requirements.txt .
COPY images/ images/
COPY tf_model/ tf_model/

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["python", "server.py"]