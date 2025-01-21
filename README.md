
# Tatil Rezervasyon Uygulaması

Bu proje, kullanıcıların tatil rezervasyonları yapabilmesini sağlayan bir tatil rezervasyon sistemidir. Uygulama, kullanıcıların tatil yerlerini incelemesine, rezervasyon yapmasına ve favorilerine eklemesine olanak tanır.

## Kullanılan Teknolojiler
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Java (Spring Boot), PostgreSQL
- **Veritabanı:** PostgreSQL

## Özellikler
- Kullanıcıların tatil yerlerini görüntüleyebilmesi
- Kullanıcıların tarih aralığına göre rezervasyon yapabilmesi
- Favorilere ekleme özelliği
- Kullanıcı girişi ve kimlik doğrulama

## Başlangıç

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Gereksinimler
- Java 21 veya daha yeni bir sürüm
- PostgreSQL veritabanı
- Node.js ve npm

### Projeyi Çalıştırmak

#### Backend (Spring Boot)

1. Proje dizininde terminali açın ve Spring Boot uygulamasını başlatın:

   ```bash
   ./mvnw spring-boot:run
   ```

2. Uygulama, varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.

3. PostgreSQL veritabanı bağlantı ayarlarını `application.properties` dosyasına yapın:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/veritabani_adi
   spring.datasource.username=postgres
   spring.datasource.password=parolaniz
   ```

> **Backend için kaynak kodları ve daha fazla bilgiye ulaşmak için:**
> [Gazi BnB Backend GitHub Repository](https://github.com/atillaertas1/gazibnb-backend)

#### Frontend (React)

1. Frontend dizinine gidin ve gerekli bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Uygulamayı başlatın:

   ```bash
   npm start
   ```

   Uygulama, varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Veritabanı Yapısı

Projede kullanılan ana veritabanı tabloları şunlardır:

- **Kullanıcılar:** Kullanıcı bilgilerini saklar.
- **Listelemeler:** Tatil yerlerinin bilgilerini içerir.
- **Rezervasyonlar:** Yapılan rezervasyonların kayıtlarını tutar.
- **Favoriler:** Kullanıcıların favorilerine eklediği listelemeleri saklar.

