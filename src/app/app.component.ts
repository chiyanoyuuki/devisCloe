import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { jsPDF } from 'jspdf';
import { CommonModule, DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DatePipe],
})
export class AppComponent implements OnInit {
  values: any = [];
  dataprestas: any = [];
  prestas: any = [
    {
      nom: 'Frais de déplacement Jour-J (Aller/Retour)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Frais de déplacement Essai (Aller/Retour)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Frais de déplacement renfort (Aller/Retour)',
      prix: 0.4,
      kilorly: true,
    },
    {
      nom: 'Mariée (essai et jour-J)',
      titre: true,
    },
    {
      nom: 'Forfait Mariée Complet',
      prix: 420,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Maquillage Mariée ',
      prix: 220,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Coiffure Mariée',
      prix: 220,
      onlyOne: true,
      bride: true,
    },
    {
      nom: 'Maquillage et coiffure supplémentaire (Mariage civil, seconde muse en beauté)',
      prix: 300,
      bride: true,
    },
    {
      nom: 'Invitée (jour-J)',
      titre: true,
    },
    {
      nom: 'Forfait Invitée Complet',
      prix: 130,
    },
    {
      nom: 'Coiffure Invitée (Attache complète)',
      prix: 80,
    },
    {
      nom: 'Coiffure Invitée (Attache partielle)',
      prix: 70,
    },
    {
      nom: 'Brushing Hollywoodien Invitée',
      prix: 70,
    },
    {
      nom: 'Maquillage Invitée',
      prix: 65,
    },
    {
      nom: 'Coiffure enfant (-13ans)',
      prix: 30,
    },
    {
      nom: 'Options',
      titre: true,
    },
    {
      nom: 'Pose Faux-cils',
      prix: 10,
    },
    {
      nom: 'Pose Faux-cils (bouquets)',
      prix: 0,
    },
    {
      nom: 'Maquillage Marié',
      prix: 30,
      onlyOne: true,
    },
    {
      nom: 'Présence avant 7h',
      prix: 30,
      onlyOne: true,
    },
    {
      nom: 'Suivi Mariée',
      prix: 50,
      hourly: true,
    },
  ];

  mode = 'devis';
  public innerWidth: any = window.innerWidth;
  public innerHeight: any = window.innerHeight;
  paysage = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = event.target.innerHeight;
    this.innerWidth = event.target.innerWidth;

    if (event.target.innerHeight > event.target.innerWidth)
      this.paysage = false;
    else this.paysage = true;
  }

  constructor(private datePipe: DatePipe, private http: HttpClient) {
    const now = new Date();
    let twoweeks = new Date();
    twoweeks = new Date(twoweeks.getTime() + 14 * 24 * 60 * 60 * 1000);
    let sixmonth = new Date();
    sixmonth = new Date(sixmonth.getTime() + 30 * 24 * 6 * 60 * 60 * 1000);
    this.values[0] = this.datePipe.transform(now, 'dd/MM/yyyy') || '';
    this.values[1] = '1';
    this.values[2] = this.datePipe.transform(now, 'yyyy') || '';
    this.values[3] = 'Cloé Chaudron';
    this.values[5] = '126 Rue de la Cerisaie';
    this.values[7] = '84400 Gargas';
    this.values[9] = '06.68.64.44.02';
    this.values[11] = 'cloe.chaudron@outlook.com';
    this.values[13] = this.datePipe.transform(twoweeks, 'dd/MM/yyyy') || '';
    this.values[14] = this.datePipe.transform(sixmonth, 'dd/MM/yyyy') || '';
    this.values[15] = '';
    this.values[16] = 'Virement';

    this.prestas.forEach((presta: any) => {
      presta.qte = 0;
    });
  }

  ngOnInit() {
    if (this.innerHeight > this.innerWidth) this.paysage = false;
    else this.paysage = true;
    //this.getDevis();
  }

  generatePDFfromHTML() {
    const element = document.getElementById('htmlContent');

    html2canvas(element!, { scale: 4 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // Largeur en mm pour A4
      const pageHeight = 297; // Hauteur pour A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      let nom = 'DEVIS_';
      if (this.mode == 'facture') nom = 'FACTURE_';
      if (this.values[1] < 100) nom = nom + '0';
      if (this.values[1] < 10) nom = nom + '0';
      nom = nom + this.values[1];
      nom = nom + '_' + this.values[2];

      pdf.save(nom + '.pdf');
      //this.trackVisit();
    });
  }

  addPresta() {
    this.prestas.push({ nom: '', qte: 0, prix: 50, reduc: '' });
  }

  calc(presta: any) {
    let prix = presta.prix * presta.qte;
    if (presta.reduc) prix = prix - (prix * presta.reduc) / 100;
    if (presta.kilorly && presta.qte < 11) prix = 0;
    return Math.floor(prix);
  }

  calcTot(calcDeja: boolean = false) {
    let prix = 0;
    this.prestas
      .filter((presta: any) => presta.qte > 0)
      .forEach((presta: any) => {
        prix += this.calc(presta);
      });
    if (calcDeja && this.values[15] != '') prix = prix - this.values[15];
    return Math.floor(prix);
  }

  calcares() {
    let prix = 0;
    this.prestas
      .filter((presta: any) => presta.bride && presta.qte > 0)
      .forEach((presta: any) => {
        prix += this.calc(presta);
      });
    if (prix != 0) prix = 0.3 * prix;
    return Math.floor(prix);
  }

  getDevis() {
    this.http
      .get<any>(
        'http' +
          (isDevMode() ? '' : 's') +
          '://chiyanh.cluster031.hosting.ovh.net/devisget'
      )
      .subscribe((data) => {
        this.values[1] = data.num;
      });
  }

  trackVisit() {
    const dataToSend = {
      num: this.values[1] + 1,
    };
    from(
      fetch(
        'http' +
          (isDevMode() ? '' : 's') +
          '://chiyanh.cluster031.hosting.ovh.net/devisset',
        {
          body: JSON.stringify(dataToSend),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          mode: 'no-cors',
        }
      )
    ).subscribe((data: any) => {});
  }
}
