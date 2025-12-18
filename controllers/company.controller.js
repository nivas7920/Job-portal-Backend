import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const registerCompany = async (req, res)=>{
    try{
        const { companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message: "Comapny name is required.",
                success: false
            });
        };
        let company = await Company.findOne({name: companyName});
        if(company){
            return res.status(400).json({
                message: "You can't registered same company",
                status: false
            });
        };
        company = await Company.create({
            name : companyName,
            userId : req.id // middleware authentication
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    }
    catch(error){
        console.log(error);
    }
};


export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};


export const getCompanyById = async (req, res)=>{
    try{
        const {id} = req.params;
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({
                message : "Company not found",
                success : false
            });
        };
        return res.status(200).json({
            company,
            success : true
        });
    }
    catch(error){
        console.log(error);
    }
};

export const updateCompany = async (req, res)=>{
    try{
        const {id} = req.params
        const {name, description, website, location} = req.body;
        const file = req.file;
        let cloudResponse;
        let logo;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }
        const updateData = {name, description, website, location, logo};

        const company = await Company.findByIdAndUpdate(id, updateData, {new: true});
        if(!company){
            return res.status(404).json({
                message : "Company not found",
                success : false
            });
        };

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success : true
        })
    }
    catch(error){
        console.log(error);
    }
}