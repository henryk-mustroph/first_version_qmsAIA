import React from 'react';
import './LegalPage.css';

import NavBar from "../../../components/NavBar/NavBar"

const LegalPage = () => {
    return (
        <div className="legal-page">
            <NavBar/>
            <div className='legal-page-text'>
                <h1 align='center'>
                    EU Artificial Intelligence Act
                </h1>
                <h2>Introduction</h2>
                <p>
                    The EU Artificial Intelligence Act (AIA) [1] is a comprehensive legislative framework
                    aimed at regulating the development, deployment, and use of artificial intelligence
                    systems within the European Union. The EU AIA categorizes AI systems into 4 different risk classes.
                    This is a summary of the legal text. For more details check the full text: <a
                    href="https://artificialintelligenceact.eu/the-act/" target="_blank" rel="noopener noreferrer">EU
                    Artificial Intelligence Act</a>
                </p>

                <h2>Risk Classes:</h2>
                <h3>1. Unacceptable Risk</h3>
                <p>
                    <b>Article 5:</b> AI practices that pose unacceptable risks to safety, rights, and societal
                    well-being. One such example is the social credit system, which evaluates human behavior and
                    actions. </p>
                <h3>2. High Risk:</h3>
                <p>
                    <b>Article 6:</b> AI systems that could cause potential risks to critical areas such as health.
                    law, human rights. They are not forbidden but need to be compliant with technical pre-market and
                    post-market evaluations. High-risk AI systems are specified in Annex <span>&#8546;</span>. For
                    example an AI system used in healthcare for patient treatment could be classified as high-risk, as
                    well as a CV-scanning AI system that rank job applicants.
                </p>

                <h3>3. Limited Risk:</h3>
                <p>
                    AI systems that pose limited risks. Such systems also have only limited transparency obligations. An
                    example for such an AI system is a chatbot answering customer requests.
                </p>

                <h3>4. Low or Minimal Risk:</h3>
                <p>
                    AI systems with low or minimal risks. These systems face no transparency obligations.
                </p>


                <h2>Requirements for High-Risk AI Systems:</h2>
                <p>
                    High-risk AI systems must adhere to specific requirements and furnish the EU with documented
                    evidence detailing risk identification, analysis, assessment, and mitigation strategies. They must
                    demonstrate through technical analysis that despite being classified as high-risk applications,
                    measures are in place to limit risks effectively. These obligations are outlined across various
                    articles in Chapter 3 Section 2, and Section 3, delineating design and structure, mandatory pre- and
                    post-market checks on AI, and the necessary documentation to be prepared.
                </p>

                <h3>Design & Structure </h3>
                <p>
                    <b>Article 17 Implement Quality Management System:</b> Providers of high-risk AI systems shall put a
                    quality management system in place that ensures compliance with this regulation. It shall include for
                    example the following aspects: 1. A strategy for regulatory compliance, including conformity
                    assessment and management for modifications of legal guidelines or technical features for the AI
                    system which are then quick adoptable. 2. Techniques procedures and systematic actions to be used
                    for the design, design control, and design verification. 3. Techniques, procedures and systematic
                    actions to be used for the development, quality control, and quality assurance. 4. Examination,
                    test, and validation procedures to be carried out before, during, and after the development. 5.
                    Technical specifications and standards to fulfil the requirements set out in Chapter 2. 6. Systems
                    and procedures for data management. 7. A risk management system (Article 9). 8. A post-market
                    monitoring system (Article 61). There are some more requirements which can be red in the EU AIA full
                    text.
                </p>

                <p>
                    <b>Article 9 Implement Risk Management System:</b> Continuous iterative process planned and run
                    throughout the entire lifecycle of a high-risk AI system. It shall consists of the following steps:
                    1. Risk identification and analysis of the known reasonably foreseeable risks and throughout the
                    entire lifecycle of a high risk AI system. 2. Risk estimation and evaluation that may emerge when AI
                    system is in use. 3. Evaluation of other possible arising risks. 4. Adoption of appropriate and
                    targeted risk management measures.
                </p>

                <p>
                    <b>Article 61 Post-market Monitoring by providers and post monitoring plan for high risk AI
                        systems:</b> Shall evaluate the continuous compliance of the AI system with the requirements set
                    out in Chapter 2, after market release.
                </p>

                <h3>Pre- and Post-Market Checks: </h3>
                <p>
                    <b>Article 10 Data and Data Governance:</b> Provide for training, validation, test data proof that
                    data is not bias, discriminating against certain groups and does not break private or data
                    ownership rules.
                </p>

                <p>
                    <b>Article 12 Record keeping:</b> The use of the AI system should be 'logged'. When is the system
                    used, why is it used, by whom is it used? Transparency should be reached of how the system is used
                    after entering the market.
                </p>

                <p>
                    <b>Article 13 Transparency Provision and Information for Deployers:</b> High risk AI systems shall
                    be designed and developed in such a way to ensure that their operation is sufficiently transparent
                    to enable deployers to interpret the system's output and use appropriately.
                </p>

                <p>
                    <b>Article 15 Accuracy, Robustness and Cybersecurity:</b> High-risk AI systems shall achieve an
                    appropriate level of accuracy, robustness, and cybersecurity, and perform in those respects
                    throughout their lifecycle.
                </p>

                <h3>Documentation: </h3>
                <p>
                    <b>Article 11 Technical Documentation:</b> Shall be drawn up before the system is placed on the
                    market or put into services and shall be kept up-to-date. The AI system should document that the AI
                    system is compliant with all the requirements set out in Chapter 2. It shall contain, at a minimum,
                    the elements set out in Annex <span>&#8547;</span>.
                </p>


                {/*<img src="euaia_image.jpg" alt="EU Artificial Intelligence Act" />*/}

                <h2>GPAI Systems:</h2>
                <p>
                    General Purpose Artificial Intelligence (GPAI) presents a unique challenge in classification under
                    the risk categories outlined by the EU AIA. This is because GPAI systems are versatile and can be
                    employed across various tasks, domains, and purposes. Additionally, they possess the capability to
                    generate content, as for example Large Language Models (LLMs) which produce text.
                </p>

                <h3>Recommendations by the FLI:</h3>
                <p>
                    The Future of Life Institute presented an article called 'General Purpose AI and the AI Act' [2].
                    This article explains which obligations for high-risk AI systems should also be adopted for GPAI,
                    and what the review process for GPAI should look like.
                </p>
                <p>
                    <b>Article 3 General Purpose AI Definition:</b> GPAI means an AI system that is able to perform
                    generally applicable functions such as image/ speech recognition, audio/ video generation, pattern
                    detection question answering, translation, etc., and is able to have multiple intended and
                    unintended purposes.
                </p>

                <p>
                    <b>Article 4a Obligation for providers of GPAI:</b> Check that GPAI is compliant with requirements
                    set out in Article 15. Comply as much as possible with other requirements set out in Chapter 2.
                    Assess reasonably foreseeable misuse. Provide instructions and information about the safety.
                    Regularly assess whether the GPAI presents new risks. Register system in EU database (Article 60).
                </p>

                <p>
                    <b>Article 4b Conformity Assessment for GPAI:</b> Assessment based on quality management system and
                    assessment of the technical documentation with the involvement of a modified body referred to in
                    Annex <span>&#8550;</span>.
                </p>

                <p>
                    <b>Article 4c Conditions for other persons to be subject to the obligations for a provider:</b> Any
                    person who places on the market, puts into service or uses a general purpose AI system in any of the
                    circumstances listed in Article 28 shall be considered on of the providers.
                </p>

                <h3>EU AIA on GPAI:</h3>

                <p>The EU adopted the presented recommendations in the AIA by adding a new section presented below.
                    Although GPAI are not always classified as high-risk-systems they also need to adopt the
                    regulations and obligations set out in Chapter 5.</p>


                <p>
                    <b>Article 51 Classification of general-purpose AI models as general-purpose AI models with systemic
                        risk:</b> GPAI has systematic risk if: 1. It has high impact capabilities evaluated on the basis
                    of appropriate technical tools and methodologies. 2. When the cumulative amount of compute used for
                    its training measured in FLOPS is greater then 10<sup>25</sup>.
                </p>

                <p>
                    <b>Article 53 Transparency Obligations for providers and users of certain AI systems and GPAI
                        models:</b> Providers shall ensure that their technical solutions are effective, interoperable,
                    robust and reliable.
                </p>

                <p>
                    <b>Article 55 Obligations for providers of GPAI with systematic risk:</b>In addition to the
                    obligations listed in Article 53: 1. A model evaluation with standard protocols and tools, including
                    adversarial testing shall be performed. 2. possible systematic risk should be assessed and
                    mitigated. 3. Keep track of records. 4. Ensure adequate level of cybersecurity.
                </p>


                <h2>Aim of this Tool:</h2>

                <p>
                    The purpose of this Quality Management System (with the example on LLM) is to establish a design
                    idea, and architecture for an RMS and DMDGS integrated into a web application. This pipeline
                    combines machine computations with human oversight to estimate the risks associated with Large
                    Language Models (LLMs).
                    The tool targets providers, authorized representatives, and deployers to ensure compliance with the
                    requirements outlined in Articles 53, 55, and Chapter 3, Section 2 for high-risk AI systems.
                </p>

                <h2>Sources:</h2>

                <p className="footer">[1] European Union: Regulation of the european parliament and of the council of
                    laying down harmonised rules on artificial intelligence and amending regulations (artificial
                    intelligence act) (corrigendum 19.04.2024) (2024), 2021/0106(COD)</p>
                <p className="footer">[2] FLI (Future of life institute), General Purpose AI and the AI Act, May
                    2022</p>

            </div>

        </div>
    );
}

export default LegalPage;
