from collections import defaultdict, deque
from models import BloodUnit

blood_map = defaultdict(deque)

def add_blood_unit(unit):
    blood_map[unit.blood_group].append(unit)

def use_blood(group):
    if blood_map[group]:
        return blood_map[group].popleft()
    return None

def load_inventory(db):
    units = db.query(BloodUnit).filter(BloodUnit.status == "AVAILABLE").all()
    for u in sorted(units, key=lambda x: x.expiry_date):
        blood_map[u.blood_group].append(u)

def emergency_match(group, units_needed):
    matched = []
    for _ in range(units_needed):
        if blood_map[group]:
            matched.append(blood_map[group].popleft())
    return matched
