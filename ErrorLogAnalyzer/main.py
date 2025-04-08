import os
from split_logs import split_log_file
from count_errors import count_errors_in_file
from merge_counts import merge_counters
from top_n_errors import get_top_n_errors

def main():
    input_file = r"C:\Users\User\Desktop\הדסים\logs.txt"
    N = 10

    print("Splitting file...")
    parts = split_log_file(input_file)

    print("Counting errors in each part...")
    all_counts = []
    for part in parts:
        count = count_errors_in_file(part)
        all_counts.append(count)

    print("Merging counts...")
    merged_counts = merge_counters(all_counts)

    print(f"Top {N} errors:")
    top_errors = get_top_n_errors(merged_counts, N)
    for error, count in top_errors:
        print(f"{error}: {count}")

if __name__ == "__main__":
    main()
