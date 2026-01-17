from collections import deque
from datetime import date

# Hash Map: blood_group -> Queue
blood_map = {}

def add_blood_unit(unit):
    if unit.blood_group not in blood_map:
        blood_map[unit.blood_group] = deque()
    blood_map[unit.blood_group].append(unit)

def use_blood(blood_group):
    if blood_group in blood_map and blood_map[blood_group]:
        return blood_map[blood_group].popleft()  # FIFO
    return None

def sort_by_expiry(units):
    return sorted(units, key=lambda x: x.expiry_date)
