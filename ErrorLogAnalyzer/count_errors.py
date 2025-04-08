from collections import Counter

def count_errors_in_file(file_path):
    counter = Counter()
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            error_code = line.strip()
            counter[error_code] += 1
    return counter
