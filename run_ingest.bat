@echo off
cd /d C:\Users\all3n\music-quant
call venv\Scripts\activate
python -m ingestion.ingest >> logs\ingest.log 2>&1