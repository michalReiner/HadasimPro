import pandas as pd
from datetime import datetime

def load_and_clean_csv(filepath: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)

    def is_valid_timestamp(ts):
        try:
            datetime.strptime(ts, "%d/%m/%Y %H:%M")
            return True
        except ValueError:
            return False

    #invalid timestamps
    df = df[df['timestamp'].apply(is_valid_timestamp)]
    df['timestamp'] = pd.to_datetime(df['timestamp'], format="%d/%m/%Y %H:%M")

    #Remove duplicate
    df = df.drop_duplicates(subset='timestamp')

    #Remove non-numeric
    df = df[pd.to_numeric(df['value'], errors='coerce').notnull()]
    df['value'] = df['value'].astype(float)
    return df
