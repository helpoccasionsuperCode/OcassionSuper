// // const Joi = require("joi");

// // // Pure validation function - no Express logic
// // const validateVendorRegistration = (data) => {
// //     console.log("Validator: Input data:", data);
    
// //     const schema = Joi.object({
// //         businessName: Joi.string().min(2).max(100).required(),
// //         ownerName: Joi.string().min(2).max(50).required(),
// //         email: Joi.string().email().required(),
// //         phone: Joi.string().pattern(/^\d{7,15}$/).required(),
// //         city: Joi.string().min(2).max(50).required(),
// //         serviceArea: Joi.string().required(),
// //         socialMedia: Joi.string().min(1).required(),
// //         categories: Joi.array().items(Joi.string()).min(1).required(),
// //         images: Joi.array().optional().allow(null),
// //         videos: Joi.array().optional().allow(null),
// //         packages: Joi.array().items(Joi.object({
// //             title: Joi.string().required(),
// //             price: Joi.string().required(),
// //             description: Joi.string().required(),
// //             inclusions: Joi.string().optional().allow("")
// //         })).optional(),
// //         documents: Joi.object({
// //             gst: Joi.array().optional().allow(null),
// //             businessProof: Joi.array().optional().allow(null),
// //             idProof: Joi.array().optional().allow(null),
// //         }).optional().allow(null),
// //         bankDetails: Joi.object({
// //             accountHolder: Joi.string().optional().allow("", null),
// //             accountNumber: Joi.string().optional().allow("", null),
// //             ifsc: Joi.string().optional().allow("", null),
// //         }).optional().allow(null)
// //     });

// //     const result = schema.validate(data);
// //     console.log("Validator: Validation result:", { 
// //         error: result.error?.message, 
// //         value: result.value 
// //     });
    
// //     return result;
// // };

// // module.exports = {
// //     validateVendorRegistration
// // };

// const Joi = require("joi");

// const validateVendorRegistration = (data) => {
//   console.log("Validator: Input data:", data);

//   const schema = Joi.object({
//     businessName: Joi.string().min(2).max(100).required(),
//     ownerName: Joi.string().min(2).max(50).required(),
//     email: Joi.string().email().required(),
//     phone: Joi.string().pattern(/^\d{7,15}$/).required(),
//     city: Joi.string().min(2).max(50).required(),
//     serviceArea: Joi.string().required(),
//     socialMedia: Joi.string().min(1).required(),
//     categories: Joi.array().items(Joi.string()).min(1).required(),
//     images: Joi.array().items(Joi.string().uri()).optional().allow(null),
//     videos: Joi.array().items(Joi.string().uri()).optional().allow(null),
//     packages: Joi.array().items(Joi.object({
//       title: Joi.string().required(),
//       price: Joi.string().required(),
//       description: Joi.string().required(),
//       inclusions: Joi.string().optional().allow("")
//     })).optional(),
//     // documents: Joi.object({
//     //   gst: Joi.array().items(Joi.string().uri()).optional().allow(null),
//     //   businessProof: Joi.array().items(Joi.string().uri()).optional().allow(null),
//     //   idProof: Joi.array().items(Joi.string().uri()).optional().allow(null),
//     // }).optional().allow(null),
//     documents: Joi.object({
//       gst: Joi.alternatives().try(Joi.array().items(Joi.string().uri()), Joi.string().uri()),
//       businessProof: Joi.alternatives().try(Joi.array().items(Joi.string().uri()), Joi.string().uri()),
//       idProof: Joi.alternatives().try(Joi.array().items(Joi.string().uri()), Joi.string().uri()),

//     bankDetails: Joi.object({
//       accountHolder: Joi.string().optional().allow("", null),
//       accountNumber: Joi.string().optional().allow("", null),
//       ifsc: Joi.string().optional().allow("", null),
//     }).optional().allow(null)
//   });

//   const result = schema.validate(data, { stripUnknown: false });
//   console.log("Validator: Validation result:", {
//     error: result.error?.message,
//     value: result.value
//   });

//   return result;
// };

// module.exports = {
//      validateVendorRegistration
//  };


const Joi = require("joi");

const validateVendorRegistration = (data) => {
  console.log("Validator: Input data:", data);
  // before Joi.validate()
if (typeof data.othersCategories === 'string') {
  try {
    data.othersCategories = JSON.parse(data.othersCategories);
  } catch (e) {
    data.othersCategories = [];
  }
}


  const schema = Joi.object({
    businessName: Joi.string().min(2).max(100).required(),
    ownerName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().pattern(/@gmail\.com$/).required().messages({
      'string.pattern.base': 'Email must contain @gmail.com'
    }),
    phone: Joi.string().pattern(/^\d{10}$/).required().messages({
      'string.pattern.base': 'Invalid mobile number. Please enter exactly 10 digits.'
    }),
    city: Joi.string().min(2).max(50).required(),
    serviceArea: Joi.string().required(),
    socialMedia: Joi.string().min(1).optional().allow("", null),
    categories: Joi.array().items(Joi.string()).min(1).required(),
    othersCategories: Joi.array().items(Joi.string().min(1)).optional(),
    images: Joi.array().items(Joi.string().uri()).optional().allow(null),
    videos: Joi.array().items(Joi.string().uri()).optional().allow(null),
    packages: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      price: Joi.string().required(),
      description: Joi.string().required(),
      inclusions: Joi.string().optional().allow("")
    })).optional(),
    // Allow gst as top-level field for backward compatibility
    gst: Joi.alternatives().try(
      Joi.array().items(Joi.string().uri()),
      Joi.string().uri()
    ).optional().allow(null),
    businessProof: Joi.alternatives().try(
      Joi.array().items(Joi.string().uri()),
      Joi.string().uri()
    ).optional().allow(null),
    idProof: Joi.alternatives().try(
      Joi.array().items(Joi.string().uri()),
      Joi.string().uri()
    ).optional().allow(null),
    documents: Joi.object({
      gst: Joi.alternatives().try(
        Joi.array().items(Joi.string().uri()),
        Joi.string().uri()
      ).optional().allow(null),
      businessProof: Joi.alternatives().try(
        Joi.array().items(Joi.string().uri()),
        Joi.string().uri()
      ).optional().allow(null),
      idProof: Joi.alternatives().try(
        Joi.array().items(Joi.string().uri()),
        Joi.string().uri()
      ).optional().allow(null),
    }).optional().allow(null),
    bankDetails: Joi.object({
      accountHolder: Joi.string().optional().allow("", null),
      accountNumber: Joi.string().optional().allow("", null),
      ifsc: Joi.string().optional().allow("", null),
    }).optional().allow(null)
  });

  const result = schema.validate(data, { stripUnknown: false });
  console.log("Validator: Validation result:", {
    error: result.error?.message,
    value: result.value
  });

  return result;
};

module.exports = { validateVendorRegistration };
