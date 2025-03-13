package com.example.model;

public class Block {
        private String id;
        private String type; // "text", "image", "chart", "table", "workflow"
        private int startX;
        private int startY;
        private int endX;
        private int endY;
        private String content; // Contenu du bloc

    public void setId(String id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setStartY(int startY) {
        this.startY = startY;
    }

    public void setStartX(int startX) {
        this.startX = startX;
    }

    public void setEndY(int endY) {
        this.endY = endY;
    }

    public void setEndX(int endX) {
        this.endX = endX;
    }

    public int getEndY() {
        return endY;
    }

    public String getId() {
        return id;
    }

    public int getStartY() {
        return startY;
    }

    public int getStartX() {
        return startX;
    }

    public int getEndX() {
        return endX;
    }

    public String getContent() {
        return content;
    }

    public String getType() {
        return type;
    }
}