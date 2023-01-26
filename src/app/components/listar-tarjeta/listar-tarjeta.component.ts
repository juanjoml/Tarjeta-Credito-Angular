import { Component, OnInit } from '@angular/core';
import { TarjetaService } from '../../services/tarjeta.service';
import { TarjetaCredito } from '../../models/TarjetaCredito';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: TarjetaCredito[] = [];

  constructor(private tarjetaService: TarjetaService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this.tarjetaService.obtenerTarjetas().
    subscribe(doc => {
      this.listTarjetas = [];
      doc.forEach((element: any) => {
        this.listTarjetas.push({
          id:element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.listTarjetas);
    })
  }

  eliminarTarjeta(id:any){
    this.tarjetaService.eliminarTarjeta(id).
    then(()=>{
      this.toastr.error('¡La tarjeta fue eliminada con éxito!', 'Registro eliminado')
    }, error =>{
      this.toastr.error('¡Opss... ocurrió un error!', 'Error');
      console.log(error);
    })
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this.tarjetaService.addTarjetaEdit(tarjeta);
  }

}
