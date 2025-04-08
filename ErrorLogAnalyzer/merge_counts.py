from collections import Counter

def merge_counters(counters):
    total = Counter()
    for c in counters:
        total.update(c)
    return total
