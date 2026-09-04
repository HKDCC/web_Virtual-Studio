import urllib.request
import pickle
import json
import os
import pandas as pd
import time

def fetch_latest_pkl():
    url = "https://huggingface.co/api/spaces/lmsys/chatbot-arena-leaderboard/tree/main"
    print("Fetching LMSYS file list...")
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    pkl_files = [f['path'] for f in data if f['path'].endswith('.pkl')]
    pkl_files.sort()
    latest_pkl = pkl_files[-1]
    
    # The pickle is an intermediate download, not deployable site data.
    cache_dir = os.path.join(os.path.dirname(__file__), "..", ".cache", "arena")
    pkl_path = os.path.join(cache_dir, "latest.pkl")
    os.makedirs(cache_dir, exist_ok=True)
    
    pkl_url = f"https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard/resolve/main/{latest_pkl}"
    print(f"Downloading {latest_pkl} from HF...")
    urllib.request.urlretrieve(pkl_url, pkl_path)
    return pkl_path

def safe_get_rating(df, model_name):
    try:
        if model_name in df.index:
            return round(df.loc[model_name, 'rating'])
    except Exception:
        pass
    return 1000

def parse_pkl(pkl_path):
    print("Parsing Pickle data...")
    df_raw = pd.read_pickle(pkl_path)
    text_data = df_raw.get('text', {})
    
    # Extract dataframes
    full_df = text_data.get('full', {}).get('leaderboard_table_df', pd.DataFrame())
    coding_df = text_data.get('coding', {}).get('leaderboard_table_df', pd.DataFrame())
    hard_df = text_data.get('hard_6', {}).get('leaderboard_table_df', pd.DataFrame())
    math_df = text_data.get('math', {}).get('leaderboard_table_df', pd.DataFrame())
    chat_df = text_data.get('if', {}).get('leaderboard_table_df', pd.DataFrame())
    long_df = text_data.get('long_user', {}).get('leaderboard_table_df', pd.DataFrame())
    
    models = []
    
    if not full_df.empty:
        # We will process all models present in the 'full' category
        for model_name in full_df.index:
            overall = safe_get_rating(full_df, model_name)
            coding = safe_get_rating(coding_df, model_name) if not coding_df.empty else overall
            agent = safe_get_rating(hard_df, model_name) if not hard_df.empty else overall
            science = safe_get_rating(math_df, model_name) if not math_df.empty else overall
            chat = safe_get_rating(chat_df, model_name) if not chat_df.empty else overall
            longContext = safe_get_rating(long_df, model_name) if not long_df.empty else overall
            
            # factuality is not always explicitly there, use overall or hard_6
            factuality = agent
            
            # ensure no zeros
            models.append({
                "name": model_name,
                "key": model_name.lower(),
                "scores": {
                    "overall": overall,
                    "chat": chat,
                    "coding": coding,
                    "longContext": longContext,
                    "science": science,
                    "factuality": factuality,
                    "agent": agent
                }
            })
    
    return models

def main():
    try:
        pkl_path = fetch_latest_pkl()
        models = parse_pkl(pkl_path)
        
        # Calculate min and max for normalization
        scores = [m['scores']['overall'] for m in models]
        min_elo = min(scores) if scores else 900
        max_elo = max(scores) if scores else 1500
        
        arena_data = {
            "source": "LMSYS Official Data",
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "models": models,
                "minElo": min_elo,
                "maxElo": max_elo
            }
        }
        
        out_path = os.path.join(os.path.dirname(__file__), "..", "data", "arena_data.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(arena_data, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully generated arena_data.json with {len(models)} models.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
