package com.example.service;

import com.example.model.Produit;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportExcelService {

    public byte[] exportProduitsToExcel(List<Produit> produits) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Produits");

        // Création de l'en-tête
        Row headerRow = sheet.createRow(0);
        String[] columns = {"ID", "Nom", "Prix", "Description", "Quantité en Stock", "Catégorie", "Image URL", "Date d'Expiration"};
        
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            cell.setCellStyle(style);
        }

        // Remplissage des données
        int rowNum = 1;
        for (Produit produit : produits) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(produit.getId());
            row.createCell(1).setCellValue(produit.getNom());
            row.createCell(2).setCellValue(produit.getPrix());
            row.createCell(3).setCellValue(produit.getDescription());
            row.createCell(4).setCellValue(produit.getQuantiteStock());
            row.createCell(5).setCellValue(produit.getCategorie());
            row.createCell(6).setCellValue(produit.getImageUrl());
            row.createCell(7).setCellValue(produit.getDateExpiration().toString());
        }

        // Ajuster la taille des colonnes
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Écriture du fichier
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
}
