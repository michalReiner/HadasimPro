import os

def split_log_file(input_path, lines_per_file=100000):
    base_path = os.path.dirname(input_path)
    output_files = []
    with open(input_path, 'r', encoding='utf-8') as f:
        count = 0
        part = 0
        out_file = None
        for line in f:
            if count % lines_per_file == 0:
                if out_file:
                    out_file.close()
                part_filename = os.path.join(base_path, f'log_part_{part}.txt')
                output_files.append(part_filename)
                out_file = open(part_filename, 'w', encoding='utf-8')
                part += 1
            out_file.write(line)
            count += 1
        if out_file:
            out_file.close()
    return output_files
