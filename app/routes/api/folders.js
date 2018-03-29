const express = require('express'),
	folders = express.Router(),
	fs = require('fs'),
	path = require('path'),
	Users = require('../../db/schemas/users');

folders.post('/create/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let folder_path = '/firecodata' + req.body.path + '/' + req.body.folder_name;
			fs.mkdir(folder_path, 0o777, (err) =>{
				if(err)
					res.status(400).json({err});
				res.json({message: 'Dossier créé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.delete('/delete', (req, res) => {
	res.json('API destinee a la suppression de dossiers');
});

folders.post('/rename/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let folder_path = '/firecodata' + req.body.path;
			fs.rename(folder_path + '/' + req.body.folder_name, folder_path + '/' + req.body.new_folder_name, (err) =>{
				if(err)
					res.status(400).json({message: 'Le dossier n\'existe pas ou le chemin d\'accès est incorrect.'});
				res.json({message: 'Dossier renomé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});});

folders.post('/content/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let output = {content: []};
			let folderpath = '/firecodata' + req.body.folder;
			fs.readdir(folderpath, (err, files) => {
				if (err) {
					res.status(400).json('Le dossier n\'existe pas ou le chemin d\'accès est incorrect.');
				} else {
					files.forEach(file => {
						let type = 'folder';
						let realpath = path.join(folderpath, file);
						if (fs.statSync(realpath).isFile())
							type = 'file';

						output.content.push({
							'name': file,
							type,
							'path': folderpath
						});
					});
					res.json(output);
				}
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.get('/', (req, res) => {
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

module.exports = folders;