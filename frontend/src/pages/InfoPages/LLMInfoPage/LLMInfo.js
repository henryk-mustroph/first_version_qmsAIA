import React from 'react';

import './LLMInfo.css';

import NavBar from "../../../components/NavBar/NavBar";

import microsoft_phi from "../../../static/images/llm_info_page/microsoft_phi.svg"


const LLMInfoPage = () => {
    return (
        <div className="llm-page">
            <NavBar/>
            <div className='llm-page-text'>
                <h1>Available Large Language Models in this Tool:</h1>
                <p>
                    In the current beta v1 the following model from Hugging Face can be loaded.
                </p>

                <h3>Microsoft's Phi3-mini-128k instruct</h3>
                <img src={microsoft_phi} alt="Microsoft Phi3-mini-128k instruct" className="llm-image"/>
                <p>Model Size: 3.8B parameters</p>
                <p>Required GPU for inference: Full Precision: float32: 32bit = 4Byte. Each parameter requires 1Byte: 4B * 3.8*10^9 = 15.2GB of GPU VRAM</p>
                <p><a href="https://huggingface.co/microsoft/Phi-3-mini-128k-instruct" target="_blank" rel="noopener noreferrer">Check the LLM on Hugging Face</a></p>

                {/* Snackbar
                <h3>Open AI's GPT-2</h3>
                <img src={openai} alt="GPT-2" className="llm-image"/>
                <p>Model Size: 1.5B parameters</p>
                <p>Required GPU for inference: Full Precision: float32: 32bit = 4Byte. Each parameter requires 1Byte: 4B * 1,5*10^9 =
                    6GB of GPU VRAM</p>

                <h3>LLama2 7B, LLama3 8B</h3>
                <img src={meta} alt="LLama2" className="llm-image"/>
                <p>Model Size: 7B</p>
                <p>Required GPU for inference: Full Precision: float32: 32bit = 4Byte. Each parameter requires 1Byte: 4B * 7*10^9 =
                    28GB of GPU GRAM</p>
                <p>Model Size: 8B</p>
                <p>Required GPU: Full Precision: float32: 32bit = 4Byte. Each parameter requires 1Byte: 4B * 8*10^9 =
                    32GB of GPU VRAM</p>

                <h3>Mistral 7B</h3>
                <img src={mistral} alt="Mistral 7B" className="llm-image"/>
                <p>Model Size: 7B parameters</p>
                <p>Required GPU for inference: Full Precision: float32: 32bit = 4Byte. Each parameter requires 1Byte: 4B * 7*10^9 =
                    28GB of GPU VRAM</p>

                <p className="footer">[1] Open AI's GPT-2: <a href="https://huggingface.co/openai-community/gpt2"
                                                              target="_blank" rel="noopener noreferrer">More
                    Info</a> (Image Source: OpenAI Logo In Wikipedia.
                    https://commons.wikimedia.org/wiki/File:OpenAI_Logo.svg)</p>
                <p className="footer">[2] LLama2: <a href="https://huggingface.co/docs/transformers/model_doc/llama"
                                                     target="_blank" rel="noopener noreferrer">More Info</a>(Image
                    Source: Meta Platforms Inc. Logo In Wikipedia.
                    https://commons.wikimedia.org/wiki/File:Meta_Platforms_Inc._logo.svg)</p>
                <p className="footer">[3] Mistral 7B: <a href="https://huggingface.co/mistralai/Mistral-7B-v0.1"
                                                         target="_blank" rel="noopener noreferrer">More Info</a> (Image
                    Source: Mistral AI In Wikipedia. https://de.wikipedia.org/wiki/Mistral_AI)</p>
                */}
            </div>
        </div>
    );
}

export default LLMInfoPage;
