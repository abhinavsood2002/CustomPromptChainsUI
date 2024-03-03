from flask import Flask, request, send_file
from flask_cors import CORS
import torch
from diffusers import StableDiffusionPipeline
import io

## Initialise text to image model
model_id = "CompVis/stable-diffusion-v1-4"
device = "cuda"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to(device)

## Intialise Large language model
model_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")

def run_prompt(prompt, temperature):
    messages = [
    {"role": "user", "content": prompt_updated},
    ]
    inputs = tokenizer.apply_chat_template(messages, return_tensors="pt").to("cuda")
    outputs = model.generate(inputs, do_sample=True, temperature=temperature, top_p=0.9, max_new_tokens=5000)
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
    textLength = request.args.get('outputLength')
    prompt_updated = f"""Use the given context to complete the given instruction. Make your {textLength} answer in length.
Task:
{prompt}

Context:
{input_}"""
    output = run_prompt(prompt_updated, temperature)
    
    print(f"Prompt Run:\n {prompt_updated}")
    print(output)

    response = {
        'output': output,
    }
    return response

@app.route('/api/run/prompt_node', methods=['GET'])
def run_prompt_node():
    prompt = request.args.get('prompt')
    temperature = float(request.args.get('temperature'))
    textLength = request.args.get('outputLength')
    prompt_updated = f"""{prompt} Make your answer {outputLength} in length.
"""
    output = run_prompt(prompt_updated, temperature)
    
    print(f"Prompt Run:\n {prompt_updated}")
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
    app.run(debug=True)
