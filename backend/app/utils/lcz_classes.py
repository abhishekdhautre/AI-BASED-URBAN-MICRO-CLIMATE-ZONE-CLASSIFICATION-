"""
LCZ class definitions — must match the label encoding used during training.
Index 0 → LCZ 1, Index 1 → LCZ 2, ... Index 9 → LCZ 10,
Index 10 → LCZ A, ... Index 16 → LCZ G
"""

LCZ_CLASS_NAMES = [
    "LCZ 1",   # 0  — Compact High-Rise
    "LCZ 2",   # 1  — Compact Mid-Rise
    "LCZ 3",   # 2  — Compact Low-Rise
    "LCZ 4",   # 3  — Open High-Rise
    "LCZ 5",   # 4  — Open Mid-Rise
    "LCZ 6",   # 5  — Open Low-Rise
    "LCZ 7",   # 6  — Lightweight Low-Rise
    "LCZ 8",   # 7  — Large Low-Rise
    "LCZ 9",   # 8  — Sparsely Built
    "LCZ 10",  # 9  — Heavy Industry
    "LCZ A",   # 10 — Dense Trees
    "LCZ B",   # 11 — Scattered Trees
    "LCZ C",   # 12 — Bush/Scrub
    "LCZ D",   # 13 — Low Plants
    "LCZ E",   # 14 — Bare Rock/Paved
    "LCZ F",   # 15 — Bare Soil/Sand
    "LCZ G",   # 16 — Water
]

LCZ_CLASS_DISPLAY_NAMES = {
    "LCZ 1": "Compact High-Rise",
    "LCZ 2": "Compact Mid-Rise",
    "LCZ 3": "Compact Low-Rise",
    "LCZ 4": "Open High-Rise",
    "LCZ 5": "Open Mid-Rise",
    "LCZ 6": "Open Low-Rise",
    "LCZ 7": "Lightweight Low-Rise",
    "LCZ 8": "Large Low-Rise",
    "LCZ 9": "Sparsely Built",
    "LCZ 10": "Heavy Industry",
    "LCZ A": "Dense Trees",
    "LCZ B": "Scattered Trees",
    "LCZ C": "Bush/Scrub",
    "LCZ D": "Low Plants",
    "LCZ E": "Bare Rock/Paved",
    "LCZ F": "Bare Soil/Sand",
    "LCZ G": "Water",
}

NUM_CLASSES = len(LCZ_CLASS_NAMES)
