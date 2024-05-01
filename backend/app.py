from flask import Flask, request, send_file
from flask_cors import CORS
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import io
from transformers import AutoModelForCausalLM, AutoTokenizer


## Initialise text to image model
model_id = "stabilityai/stable-diffusion-2-1"
device = "cuda"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe = pipe.to(device)

## Intialise Large language model
model_id = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")

def instruction_for_text_length(textLength):
    match textLength:
        case "very short":
            return "Ensure your response is very short (30-70 words)."
        case "short":
            return "Ensure your response is short (70-150 words)."
        case "medium":
            return "Ensure your response is medium (150-300 words) in length."
        case "long":
            return "Ensure your response is thorough (300+ words) in length."

def run_prompt(prompt, temperature):
    do_sample = temperature != 0
    messages = [
    {"role": "user", "content": prompt},
    ]
    inputs = tokenizer.apply_chat_template(messages, return_tensors="pt").to("cuda")
    outputs = model.generate(inputs, do_sample=do_sample, temperature=temperature, top_p=0.9, max_new_tokens=5000)
    prompt_length = inputs[0].shape[0]
    output = tokenizer.decode(outputs[0][prompt_length:], skip_special_tokens=True)
    return output

app = Flask(__name__)
CORS(app)

@app.route('/api/run/chain_node', methods=['GET'])
def run_chain_node():
    prompt = request.args.get('prompt')
    input_ = request.args.get('input')
    temperature = float(request.args.get('temperature'))
    textLength = request.args.get('length')
    prompt_updated = f"""Use the given context to complete the given instruction. Do not repeat the instructions or context given. {instruction_for_text_length(textLength)}
Instruction:
{prompt}

Context:
{input_}"""
    print(f"Prompt Run:\n {prompt_updated}")
    output = run_prompt(prompt_updated, temperature)
    print(output)

    response = {
        'output': output,
    }
    return response

@app.route('/api/run/prompt_node', methods=['GET'])
def run_prompt_node():
    prompt = request.args.get('prompt')
    temperature = float(request.args.get('temperature'))
    textLength = request.args.get('length')
    prompt_updated = f"""{prompt} Do not repeat the instructions given. {instruction_for_text_length(textLength)}
"""
    print(f"Prompt Run:\n {prompt_updated}")
    output = run_prompt(prompt_updated, temperature)
    print(output)

    response = {
        'output': output,
    }
    return response

@app.route('/api/run/txt_to_img_node', methods=['GET'])
def run_txt_to_image_node():
    prompt = request.args.get('prompt')
    image = pipe(prompt).images[0]  
    img_io = io.BytesIO()
    image.save(img_io, format="PNG")
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, use_reloader=False)
