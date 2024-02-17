from flask import Flask, request
from langchain.llms import LlamaCpp
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from flask_cors import CORS

DEFAULT_PROMPT = "RETURN ERROR"
model_path = "models/tiny-llama-openhermes-1.1b-step-715k-1.5t.q4_k_m.gguf"
context_window = 1000
llm = LlamaCpp(model_path=model_path, verbose=False, f16_kv=True, n_ctx = context_window)
llm_chain = LLMChain(
    llm=llm,
    prompt = PromptTemplate.from_template(DEFAULT_PROMPT),
)

app = Flask(__name__)
CORS(app)

@app.route('/api/run/chain_node', methods=['GET'])
def run_chain_node():
    prompt = request.args.get('prompt')
    input_ = request.args.get('input')
    prompt_updated = f"""Use the given input to complete the task:
### Task
{prompt}
### Input
{input_}"""
    prompt_llm = PromptTemplate.from_template(prompt_updated)
    
    print(f"Prompt Run:\n {prompt_updated}")

    llm_chain.prompt = prompt_llm
    output = llm_chain.predict()
    llm_chain.prompt = DEFAULT_PROMPT
    print(output)

    response = {
        'output': output,
    }
    return response

if __name__ == '__main__':
    app.run(debug=True)
