/*
#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.
*/

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

            </div>
        </div>
    );
}

export default LLMInfoPage;
