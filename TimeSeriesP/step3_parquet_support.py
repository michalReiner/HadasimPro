import pandas as pd
import os

def split_by_day_and_calc_hourly_avg(df: pd.DataFrame, output_dir: str) -> pd.DataFrame:
    os.makedirs(output_dir, exist_ok=True)

    df['date'] = df['timestamp'].dt.date
    df['hour'] = df['timestamp'].dt.floor('h')

    results = []

    for date, group in df.groupby('date'):
        hourly_avg = group.groupby('hour')['value'].mean().reset_index()
        hourly_avg.columns = ['timestamp', 'value']
        output_file = os.path.join(output_dir, f"{date}.csv")
        hourly_avg.to_csv(output_file, index=False)
        results.append(hourly_avg)

    final_result = pd.concat(results).sort_values('timestamp')
    final_result.to_csv(os.path.join(output_dir, "final_hourly_averages.csv"), index=False)

    return final_result

# Parquet is a columnar, compressed file format optimized for efficient data storage and processing, especially in big data environments. Its main advantages include:

# Columnar Storage: Enables reading only the necessary columns, improving performance for analytical queries.

# Efficient Compression: Supports advanced compression techniques, significantly reducing file size compared to row-based formats like CSV.

# Support for Complex Data Types: Allows nested structures such as arrays and maps, making it suitable for rich, structured data.
