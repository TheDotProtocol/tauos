use crate::metadata::{PackageSignature, MetadataError};
use ring::signature::{Ed25519KeyPair, UnparsedPublicKey, ED25519};
use ring::rand::SystemRandom;
use base64::{Engine as _, engine::general_purpose};
use std::fs;
use std::path::Path;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum SignatureError {
    #[error("Invalid signature format")]
    InvalidSignature,
    #[error("Invalid public key format")]
    InvalidPublicKey,
    #[error("Signature verification failed")]
    VerificationFailed,
    #[error("Unsupported algorithm: {0}")]
    UnsupportedAlgorithm(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Base64 decode error: {0}")]
    Base64Error(#[from] base64::DecodeError),
}

pub struct SignatureVerifier {
    trusted_keys: Vec<Vec<u8>>,
}

impl SignatureVerifier {
    pub fn new() -> Self {
        Self {
            trusted_keys: Vec::new(),
        }
    }
    
    pub fn add_trusted_key(&mut self, key_data: &[u8]) {
        self.trusted_keys.push(key_data.to_vec());
    }
    
    pub fn load_trusted_keys_from_file(&mut self, path: &Path) -> Result<(), SignatureError> {
        let content = fs::read_to_string(path)?;
        for line in content.lines() {
            let line = line.trim();
            if !line.is_empty() && !line.starts_with('#') {
                let key_data = general_purpose::STANDARD.decode(line)?;
                self.add_trusted_key(&key_data);
            }
        }
        Ok(())
    }
    
    pub fn verify_package_signature(
        &self,
        signature: &PackageSignature,
        package_data: &[u8],
    ) -> Result<bool, SignatureError> {
        match signature.algorithm.as_str() {
            "ed25519" => self.verify_ed25519_signature(signature, package_data),
            "rsa" => self.verify_rsa_signature(signature, package_data),
            _ => Err(SignatureError::UnsupportedAlgorithm(signature.algorithm.clone())),
        }
    }
    
    fn verify_ed25519_signature(
        &self,
        signature: &PackageSignature,
        package_data: &[u8],
    ) -> Result<bool, SignatureError> {
        let public_key_data = general_purpose::STANDARD.decode(&signature.public_key)?;
        let signature_data = general_purpose::STANDARD.decode(&signature.signature)?;
        
        if signature_data.len() != 64 {
            return Err(SignatureError::InvalidSignature);
        }
        
        let public_key = UnparsedPublicKey::new(&ED25519, &public_key_data);
        
        match public_key.verify(package_data, &signature_data) {
            Ok(()) => Ok(true),
            Err(_) => Ok(false),
        }
    }
    
    fn verify_rsa_signature(
        &self,
        signature: &PackageSignature,
        package_data: &[u8],
    ) -> Result<bool, SignatureError> {
        // For now, we'll implement a basic RSA verification
        // In a production system, you'd want to use a proper RSA implementation
        log::warn!("RSA signature verification not fully implemented");
        Ok(true) // Placeholder
    }
    
    pub fn is_trusted_key(&self, key_data: &[u8]) -> bool {
        self.trusted_keys.iter().any(|trusted| trusted == key_data)
    }
}

pub fn generate_keypair() -> Result<(Vec<u8>, Vec<u8>), SignatureError> {
    let rng = SystemRandom::new();
    let keypair = Ed25519KeyPair::generate_pkcs8(&rng)
        .map_err(|_| SignatureError::InvalidSignature)?;
    
    let public_key = keypair.public_key().as_ref().to_vec();
    let private_key = keypair.as_ref().to_vec();
    
    Ok((public_key, private_key))
}

pub fn sign_package_data(
    private_key: &[u8],
    package_data: &[u8],
) -> Result<Vec<u8>, SignatureError> {
    let keypair = Ed25519KeyPair::from_pkcs8(private_key)
        .map_err(|_| SignatureError::InvalidPublicKey)?;
    
    let signature = keypair.sign(package_data);
    Ok(signature.as_ref().to_vec())
} 