import os
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import DataCollatorForLanguageModeling, TrainingArguments, Trainer
from torch.utils.data import Dataset

# 🔐 Securely Load Hugging Face Token
HUGGINGFACE_TOKEN = os.getenv("HF_TOKEN")  # Set this in your environment variables

MODEL_NAME = "deepseek-ai/deepseek-coder-6.7b"

# ✅ Try loading the model, fallback if unavailable
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=HUGGINGFACE_TOKEN)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, token=HUGGINGFACE_TOKEN)
except Exception as e:
    print(f"Error loading {MODEL_NAME}, switching to Mistral-7B-Instruct.")
    MODEL_NAME = "mistralai/Mistral-7B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# ✅ Custom Dataset Class
class JsonDataset(Dataset):
    def __init__(self, file_path, tokenizer, block_size=128):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.examples = []
        for entry in data:
            prompt = entry["prompt"]
            answer = entry["answer"]
            text = f"{prompt} {answer}"
            tokenized = tokenizer(
                text,
                truncation=True,
                padding="max_length",
                max_length=block_size,
                return_tensors="pt"
            )
            self.examples.append({
                "input_ids": tokenized["input_ids"].squeeze(),
                "attention_mask": tokenized["attention_mask"].squeeze(),
            })

    def __len__(self):
        return len(self.examples)

    def __getitem__(self, idx):
        return self.examples[idx]

# ✅ Load training data (Check file existence)
train_file = "test.json"
if not os.path.exists(train_file):
    raise FileNotFoundError(f"Dataset file '{train_file}' not found!")

train_dataset = JsonDataset(train_file, tokenizer, block_size=128)

# ✅ Data Collator
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer, mlm=False  # mlm=False because we're doing causal LM fine-tuning
)

# ✅ Training Arguments
training_args = TrainingArguments(
    output_dir="./finetuned_model",
    overwrite_output_dir=True,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    save_total_limit=2,
    logging_steps=100,
    prediction_loss_only=True,
    learning_rate=5e-5,
)

# ✅ Trainer Setup
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_dataset,
)

# ✅ Train the Model
trainer.train()

# ✅ Save the Fine-Tuned Model
model.save_pretrained("./finetuned_model")
tokenizer.save_pretrained("./finetuned_model")

# ✅ Text Generation Pipeline
from transformers import pipeline

generator = pipeline("text-generation", model="./finetuned_model", tokenizer="./finetuned_model")

# ✅ Generate text based on a prompt
prompt = "The future of AI in healthcare is"
output = generator(prompt, max_length=100, num_return_sequences=1)

print(output[0]['generated_text'])
