from step1_clean_data import load_and_clean_csv
from step2_split_and_average import load_and_clean_parquet
from step3_parquet_support import split_by_day_and_calc_hourly_avg

def main():
    csv_path = r"C:\Users\User\Desktop\הדסים\time_series.csv"
    parquet_path = r"C:\Users\User\Desktop\הדסים\time_series.parquet"
    output_dir = r"C:\Users\User\Desktop\הדסים\processed_output"

    print("Choose an action:")
    print("1. Load and clean CSV")
    print("2. Split by day and calculate averages (CSV)")
    print("3. Load, split, and average from Parquet")
    print("0. Exit")

    choice = input("Enter action number: ")
    if choice == "1":
        df = load_and_clean_csv(csv_path)
        print(df.head(30))

    elif choice == "2":
        df = load_and_clean_csv(csv_path)
        result = split_by_day_and_calc_hourly_avg(df, output_dir)
        print(result.head())

    elif choice == "3":
        df = load_and_clean_parquet(parquet_path)
        result = split_by_day_and_calc_hourly_avg(df, output_dir)
        print(result.head())

    elif choice == "0":
        print("Exit...")
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()
