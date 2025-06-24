# Env
## Required
- Nodejs 22
- Npm 11 (yarn 3.6)

## Start
```bash
npm install (yarn install)
```

## Run Dev
```bash
npm run start (yarn start)
```

## Run Build
```bash
npm run build (yarn build)
```

## Build subpath
```cmd
ng build --base-href /app1/
```

## Sync Multi Language
```bash
npm run s (yarn s)
```

## make page

```bash
npx ng generate component pages/<page>
```

## make module

```bash
npx ng generate module <name> --route
```
### Installation
* `npm install` (installing dependencies)
* `npm outdated` (verifying dependencies)

### Developpement
* `npm run start`
* in your browser [http://localhost:4200](http://localhost:4200) 

## Linter
* `npm run lint`

## Tests
* `npm run test`
* `npm run coverage`

### Compilation
* `npm run build`       ( without SSR)

### Production
* `npm run serve`
* in your browser [http://localhost:4200](http://localhost:4200) 

### Lib components
* ant design `https://ng.ant.design/components/overview/en`


### Menu
trang chủ: /

Giới thiệu:
	Giới thiệu item: gioi-thieu-chi-tiet?id=df57a7aa-bb9e-4950-9f53-8e1a2f07c830    id là  id của bài viết

VBQL Pháp luật: vbqp-phap-luat

Tin tức: tin-tuc

Sách hay: sach-hay

Video: medialibrary?type=video

Audio: medialibrary?type=audio

Liên hệ: contac

Thư viện ảnh: thu-vien-anh