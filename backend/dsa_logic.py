from collections import defaultdict, deque
from models import BloodUnit
from database import SessionLocal

# I change the list/heap to a deque (Double-Ended Queue) for O(1) FIFO operations
blood_inventory = defaultdict(deque)

COMPATIBILITY_MAP = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    "AB-": ["AB-", "A-", "B-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"]
}

def add_blood_unit(unit):
    # DSA Concept: Queue (FIFO)
    # Using append() adds the unit to the end of the line
    blood_inventory[unit.blood_group].append(unit)

def use_blood(group):
    # DSA Concept: Queue Pop (O(1) complexity)
    # popleft() removes the unit from the front (the oldest one added)
    if blood_inventory[group]:
        return blood_inventory[group].popleft()
    return None

def load_inventory():
    db = SessionLocal()
    try:
        blood_inventory.clear()
        # We sort by arrival/ID or Expiry here so the Queue is loaded in order
        units = db.query(BloodUnit).filter(BloodUnit.status == "AVAILABLE").order_by(BloodUnit.expiry_date).all()
        for u in units:
            blood_inventory[u.blood_group].append(u)
    finally:
        db.close()

def emergency_match(requested_group, units_needed):
    load_inventory()
    
    compatible_groups = COMPATIBILITY_MAP.get(requested_group, [])
    potential_units = []

    # Collect units from all compatible queues
    for group in compatible_groups:
        for unit in blood_inventory[group]:
            potential_units.append(unit)

    # DSA Concept: Sorting
    # Even in FIFO, we sort the combined list to ensure the most urgent blood is used
    potential_units.sort(key=lambda x: x.expiry_date) 

    if len(potential_units) < units_needed:
        return []

    return potential_units[:units_needed]