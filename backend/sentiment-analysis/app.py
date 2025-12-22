import os
from flask import Flask, request, jsonify
from transformers import pipeline
import joblib
from sqlalchemy.sql import func
from sqlalchemy import CheckConstraint
from flask_cors import CORS
from extension import db
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:qIBVqCNvzGoXUpLbdHvzIJHTumcTBXUL@crossover.proxy.rlwy.net:13019/railway'

# Tắt tính năng theo dõi sự thay đổi không cần thiết để tiết kiệm tài nguyên
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

class Review(db.Model):
    __tablename__ = 'review'

    # Khóa chính phức hợp (Composite Primary Key)
    # Vừa là khóa ngoại, vừa là khóa chính
    uid = db.Column(db.String(255), db.ForeignKey('users.uid'), primary_key=True)
    pid = db.Column(db.String(255), db.ForeignKey('products.pid'), primary_key=True)

    # TinyInt trong SQL tương đương SmallInteger hoặc Integer trong SQLAlchemy
    rate = db.Column(db.SmallInteger, nullable=False)
    
    content = db.Column(db.Text, nullable=True)
    
    # server_default=func.now() sẽ để MySQL tự điền giờ (giống default(now()) trong SQL)
    create_at = db.Column(db.DateTime, server_default=func.now())

    # Thêm Constraint CHECK (rate > 0 AND rate <= 5)
    __table_args__ = (
        CheckConstraint('rate > 0 AND rate <= 5', name='check_rate_valid'),
    )

    # --- Optional: Thiết lập quan hệ để dễ truy vấn ---
    # Ví dụ: review.user.name hoặc review.product.name
    # user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    # product = db.relationship('Product', backref=db.backref('reviews', lazy=True))

    def __repr__(self):
        return f'<Review User:{self.uid} Product:{self.pid} Rate:{self.rate}>'
# --- CẤU HÌNH ---
# List các khía cạnh bạn muốn trích xuất
DEFAULT_ASPECTS = ["Bơ", "Sốt", "Xốt", "Dầu", "Snack", "Lương khô", "Granola", "Bơ sấy"]

print("Đang khởi tạo Pipeline (Load từ local cache)...")
# Load QA Model (để tách ý)
qa_pipeline = joblib.load("model/qa_model.pkl")
# Load Sentiment Model (để phân loại)
sent_pipeline = joblib.load("model/sentiment_model.pkl")
print("Service đã sẵn sàng!")

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        print(data)
        comments = data['comments']
        print("Comments: ", comments)
        aspects = data.get('aspects', DEFAULT_ASPECTS) # Cho phép client tùy chỉnh aspect
        db_comments = Review.query.with_entities(Review.content).all()
        comments.extend([comment.content for comment in db_comments])
        if not comments or not len(comments):
            return jsonify({'error': 'No comment provided'}), 400

        results = []
        
        # 1. Quét từng khía cạnh
        for comment in comments:
            for aspect in aspects:
                question = f"{aspect} như thế nào?"
                # QA Model trích xuất đoạn text liên quan
                answer = qa_pipeline(question=question, context=comment)
                
                # Nếu score > 0.01 nghĩa là có nhắc đến (QA model này khá nhạy nên để threshold thấp)
                if answer['score'] > 0.01 and answer['answer'].strip():
                    extracted_text = answer['answer']
                    
                    # 2. Phân tích cảm xúc đoạn text đó
                    sentiment = sent_pipeline(extracted_text)[0]
                    if aspect.upper() in comment.upper():
                        results.append({
                            "aspect": aspect,
                            "extracted_text": extracted_text,
                            "sentiment": sentiment['label'], # POS/NEG/NEU
                            "confidence": round(sentiment['score'], 4)
                        })

        return jsonify({
            'original_comment': comments,
            'analysis': results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
        print("Đã kết nối và tạo bảng thành công!")
    app.run(host='0.0.0.0', port=5000, debug = True)