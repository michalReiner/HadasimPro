import pandas as pd

def load_and_clean_parquet(filepath: str) -> pd.DataFrame:
    df = pd.read_parquet(filepath)

    if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
        df['timestamp'] = pd.to_datetime(df['timestamp'])

    df = df.drop_duplicates(subset='timestamp')
    df = df[pd.to_numeric(df['value'], errors='coerce').notnull()]
    df['value'] = df['value'].astype(float)
    return df
