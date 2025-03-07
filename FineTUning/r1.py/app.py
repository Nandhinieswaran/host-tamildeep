import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import Dataset

# JSON கோப்பை UTF-8 குறியீட்டில் திறக்கவும்
with open(r"C:\Users\NANDHINI\Downloads\My_DeepTamil\FineTUning\r1.py\my_bharathifrist.json", 'r', encoding='utf-8') as f:
    data = json.load(f)

dataset = Dataset.from_list(data)

# டோக்கனைசரை ஏற்றவும்
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")

# மாதிரி மற்றும் டேட்டா கோலேட்டரை ஏற்றவும்
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
model.resize_token_embeddings(len(tokenizer))

def tokenize_function(examples):
    texts = [f"{prompt} {answer}" for prompt, answer in zip(examples["prompt"], examples["answer"])]
    tokenized = tokenizer(texts, padding="max_length", truncation=True, max_length=512, return_tensors="pt") #return_tensors="pt"
    tokenized["labels"] = tokenized["input_ids"].clone()  # Add labels here
    return tokenized

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# பயிற்சி வாதங்களை அமைக்கவும்
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,  # தேவையான எண்ணிக்கை epochs
    per_device_train_batch_size=4,
    save_steps=10_000,
    save_total_limit=2,
    remove_unused_columns=False, # Add this line
)

# பயிற்சியாளரை துவக்கவும்
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets,
    data_collator=lambda data: {'input_ids': torch.stack([f['input_ids'].squeeze(0) for f in data]),
                               'attention_mask': torch.stack([f['attention_mask'].squeeze(0) for f in data]),
                               'labels': torch.stack([f['labels'].squeeze(0) for f in data])},
)

# பயிற்சியை துவக்கவும்
trainer.train()

# ஃபைன் ட்யூன் செய்யப்பட்ட மாதிரியை சேமிக்கவும்
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")