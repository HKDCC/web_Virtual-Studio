import pandas as pd

df = pd.read_pickle("latest.pkl")
text_data = df.get('text', {})
print("Keys in text_data:", text_data.keys())

for k in ['full', 'coding', 'hard_prompts']:
    if k in text_data:
        v = text_data[k]
        if isinstance(v, dict) and 'leaderboard_table_df' in v:
            print(f"[{k}] df shape:", v['leaderboard_table_df'].shape)
            print(f"[{k}] head:", v['leaderboard_table_df'].head(3))
        else:
            print(f"[{k}] v keys:", v.keys() if isinstance(v, dict) else type(v))
